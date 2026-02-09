'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getCollection, deleteDocument } from '@/lib/firebase/firestore';
import { orderBy } from 'firebase/firestore';
import { formatDateTime } from '@/lib/utils';
import { Mail, Trash2, MessageSquare } from 'lucide-react';

interface Inquiry {
    id: string;
    name: string;
    email: string;
    message: string;
    timestamp: any;
}

export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const allInquiries = await getCollection<Inquiry>('inquiries', [
                orderBy('timestamp', 'desc'),
            ]);
            setInquiries(allInquiries);
        } catch (error) {
            console.error('Error fetching inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this inquiry?')) return;

        try {
            const result = await deleteDocument('inquiries', id);
            if (result.success) {
                setInquiries(prev => prev.filter(i => i.id !== id));
                if (selectedInquiry?.id === id) {
                    setSelectedInquiry(null);
                }
                alert('Inquiry deleted successfully');
            } else {
                alert('Failed to delete inquiry');
            }
        } catch (error) {
            console.error('Error deleting inquiry:', error);
            alert('Failed to delete inquiry');
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center py-20">
                    <div className="spinner w-8 h-8" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="font-orbitron text-3xl font-bold">
                        <span className="text-gradient">Inquiries</span>
                    </h1>
                    <div className="text-sm text-text-muted">
                        {inquiries.length} total inquiries
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Inquiries List */}
                    <div className="lg:col-span-1 space-y-4">
                        {inquiries.length === 0 ? (
                            <Card hover={false} className="text-center py-12">
                                <MessageSquare className="w-12 h-12 text-text-muted mx-auto mb-4" />
                                <p className="text-text-muted">No inquiries yet</p>
                            </Card>
                        ) : (
                            inquiries.map((inquiry) => (
                                <Card
                                    key={inquiry.id}
                                    hover
                                    className={`cursor-pointer ${selectedInquiry?.id === inquiry.id ? 'border-primary-green' : ''
                                        }`}
                                    onClick={() => setSelectedInquiry(inquiry)}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-semibold line-clamp-1">{inquiry.name}</h3>
                                            <p className="text-xs text-text-muted line-clamp-1">{inquiry.email}</p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(inquiry.id);
                                            }}
                                            className="text-red-400 hover:text-red-300 p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-text-muted">
                                        {inquiry.timestamp && formatDateTime(inquiry.timestamp.toDate())}
                                    </p>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Inquiry Detail */}
                    <div className="lg:col-span-2">
                        {selectedInquiry ? (
                            <Card hover={false}>
                                <div className="mb-6">
                                    <h2 className="font-orbitron text-xl font-bold mb-2">
                                        {selectedInquiry.name}
                                    </h2>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-text-muted">
                                        <a
                                            href={`mailto:${selectedInquiry.email}`}
                                            className="text-primary-green hover:underline flex items-center gap-1"
                                        >
                                            <Mail className="w-4 h-4" />
                                            {selectedInquiry.email}
                                        </a>
                                        <span className="hidden sm:inline">•</span>
                                        <span>
                                            {selectedInquiry.timestamp &&
                                                formatDateTime(selectedInquiry.timestamp.toDate())}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 bg-primary-green/5 rounded-lg border border-primary-green/10">
                                    <h3 className="font-semibold mb-3">Message:</h3>
                                    <div className="text-text-light whitespace-pre-wrap">
                                        {selectedInquiry.message}
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-4">
                                    <a
                                        href={`mailto:${selectedInquiry.email}?subject=Re: Your inquiry to Empyreal Energy`}
                                        className="btn-primary flex items-center gap-2 flex-1"
                                    >
                                        <Mail className="w-4 h-4" />
                                        Reply via Email
                                    </a>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleDelete(selectedInquiry.id)}
                                        className="text-red-400 border-red-400/50 hover:bg-red-400/10"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </Button>
                                </div>
                            </Card>
                        ) : (
                            <Card hover={false} className="flex items-center justify-center h-96">
                                <div className="text-center">
                                    <MessageSquare className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
                                    <p className="text-text-muted">
                                        Select an inquiry to view details
                                    </p>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}