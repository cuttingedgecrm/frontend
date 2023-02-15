import React, { useEffect, useState } from 'react';
import ClientHubInvoiceDetails from './ClientHubInvoiceDetails';
import { useParams } from 'react-router-dom';
import { getInvoice } from '../../api/invoice.api';
import { Alert, Box, CircularProgress } from '@mui/material';
import { listTaxes } from '../../api/tax.api';
import { listPayments } from '../../api/payment.api';
import { Elements } from '@stripe/react-stripe-js';
import PaymentStatus from './PaymentStatus';
import { loadStripe } from '@stripe/stripe-js';
import { retrieveAccount } from '../../api/stripePayments.api';

const stripePromise = loadStripe("pk_test_51MHcGcKeym0SOuzyTStcQlICRRKuvpbIfChvZUomCjr5kwOe5iMaJ8tqRwdP4zR81Xe1Jbu6PirohkAjQPTMwqPs001lOpJIww");

function ClientHubInvoice(props: any) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [invoice, setInvoice] = useState({} as any);
    const [taxes, setTaxes] = useState([] as any);
    const [payments, setPayments] = useState([] as any);
    const [reload, setReload] = useState(false);
    const [paymentsEnabled, setPaymentsEnabled] = useState(false);
    let { invoiceId } = useParams();
    let { clientId } = useParams();

    useEffect(() => {
        setIsLoaded(false);
        getInvoice(invoiceId)
        .then(result => {
            setInvoice(result);
            setIsLoaded(true);
        }, err => {
            setError(err.message);
            setIsLoaded(true);
        })
    }, [invoiceId])

    useEffect(() => {
        listTaxes()
        .then(res => {
            let none = {
                id: null,
                title: "No Tax",
                tax: 0
              }
              res.unshift(none);
            setTaxes(res);
        }, (err) => {
            setError(err.message);
        })
    }, [])

    useEffect(() => {
        listPayments(clientId)
        .then(res => {
            setPayments(res.filter((p: any) => (p.type === 'deposit' && p.typeId === invoice.invoice?.quote) || (p.type === 'payment' && p.typeId === invoice.invoice?.id)));
        }, (err) => {
            setError(err.message);
        })
    }, [invoice, clientId])

    useEffect(() => {
        retrieveAccount()
        .then(res => {
            if (res.stripeRes?.charges_enabled) {
                setPaymentsEnabled(true);
            }
        }, err => {
            setError(err.message);
        })
    }, [])


    if (error) {
        return (<Alert severity="error">{error}</Alert>);
        }
    if (!isLoaded) {
        return (<Box textAlign='center'><CircularProgress /></Box>);
        }

    return (
        <Elements stripe={stripePromise}>
        <PaymentStatus/>
        <ClientHubInvoiceDetails invoice={invoice} setInvoice={setInvoice} taxes={taxes} payments={payments} success={props.success} setReload={setReload} reload={reload} paymentsEnabled={paymentsEnabled} />
        </Elements>
    )
}

export default ClientHubInvoice;