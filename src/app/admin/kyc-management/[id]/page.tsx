/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DocumentViewer } from "@/components/kyc-details/DocumentViewer";
import { Breadcrumb } from "@/components/kyc-details/Breadcrumb";
import { CompanyInfoCard } from "@/components/kyc-details/CompanyInfoCard";
import { DocumentsCard } from "@/components/kyc-details/DocumentsCard";
import { ActionButtons } from "@/components/kyc-details/ActionButtons";
import { DocumentItem, KYCDetail } from "@/types/kyc";
import { kycService } from "@/services/kycService";
import { useApi } from "@/hooks/useApi";

const KYCDetailPage: React.FC = () => {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";

  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [kycData, setKycData] = useState<KYCDetail | null>(null);

  const { loading, error, execute } = useApi({
    onSuccess: (response: KYCDetail) => {
      setKycData(response);
    }
  });

  useEffect(() => {
    if (id) {
      execute(() => kycService.getKYCDetail(id));
    }
  }, [id]);

  const handleApprove = async (recordId: string, remarks: string) => {
    try {
      await kycService.approveKYC(recordId, remarks);
      alert('KYC Approved!');
      window.location.href = '/admin/kyc-management';
    } catch (error: any) {
      alert(`Failed to approve: ${error.message}`);
    }
  };

  const handleReject = async (reason: string, recordId: string, remarks: string) => {
    try {
      const result = await kycService.rejectKYC(recordId, reason, remarks);
      alert(`KYC Rejected. New KYC ID: ${result.newKycId}`);
      window.location.href = '/admin/kyc-management';
    } catch (error: any) {
      alert(`Failed to reject: ${error.message}`);
    }
  };

  // Convert backend document URLs to DocumentItem format
  const getDocuments = (kyc: KYCDetail): DocumentItem[] => {
    const docs: DocumentItem[] = [];

    if (kyc.panCardUrl) {
      docs.push({
        id: 'pan',
        name: 'PAN Card',
        type: kyc.panCardUrl.endsWith('.pdf') ? 'pdf' : 'image',
        url: kyc.panCardUrl,
        thumbnail: kyc.panCardUrl,
        pageCount: kyc.panCardUrl.endsWith('.pdf') ? 1 : undefined
      });
    }

    if (kyc.incorporationCertUrl) {
      docs.push({
        id: 'incorporation',
        name: 'Incorporation Certificate',
        type: kyc.incorporationCertUrl.endsWith('.pdf') ? 'pdf' : 'image',
        url: kyc.incorporationCertUrl,
        thumbnail: kyc.incorporationCertUrl,
        pageCount: kyc.incorporationCertUrl.endsWith('.pdf') ? 1 : undefined
      });
    }

    if (kyc.gstCertUrl) {
      docs.push({
        id: 'gst',
        name: 'GST Certificate',
        type: kyc.gstCertUrl.endsWith('.pdf') ? 'pdf' : 'image',
        url: kyc.gstCertUrl,
        thumbnail: kyc.gstCertUrl,
        pageCount: kyc.gstCertUrl.endsWith('.pdf') ? 1 : undefined
      });
    }

    if (kyc.otherDocs && Array.isArray(kyc.otherDocs)) {
      kyc.otherDocs.forEach((key, index) => {
        const isPdf = key.toLowerCase().endsWith('.pdf');

        docs.push({
          id: `other-${index}`,
          name: `Other Document ${index + 1}`,
          type: isPdf ? 'pdf' : 'image',
          url: key, // raw key (not used for loading)
          thumbnail: key,
          pageCount: isPdf ? 1 : undefined
        });
      });
    }
    return docs;
  };

  const handleOpenDocument = async (doc: DocumentItem) => {
    if (!kycData) return;
    try {
      const res = await kycService.getKycDocument(kycData.id, doc.id);

      // Update only the URL (replace S3 key with signed URL)
      setSelectedDocument({
        ...doc,
        url: res.url, // signed URL
      });
    } catch (error: any) {
      alert(error?.message || 'Failed to open KYC document');
    }
  };


  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading KYC details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !kycData) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-medium mb-2">Failed to load KYC details</p>
          <p className="text-red-600 text-sm mb-4">{error?.message || 'KYC record not found'}</p>
          <button
            onClick={() => window.location.href = '/admin/kyc-management'}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Back to KYC List
          </button>
        </div>
      </div>
    );
  }

  const documents = getDocuments(kycData);

  return (
    <div className="p-6">
      <Breadcrumb />

      <h1 className="text-3xl font-bold text-gray-900 mb-6">KYC Application Details</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CompanyInfoCard data={kycData} />
        <DocumentsCard
          documents={documents}
          onDocumentClick={handleOpenDocument}
        />
      </div>

      <ActionButtons
        recordId={kycData.id}
        status={kycData.status}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <DocumentViewer
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />
    </div>
  );
};

export default KYCDetailPage;