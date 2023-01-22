import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2'
import { Stack } from '@mui/system';
import Contact from '../../shared/client/Contact';
import Notes from '../../shared/note/Notes';
import InvoiceDetails from '../../shared/InvoiceDetails';
import { getInvoice } from '../../api/invoice.api';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import { listTaxes } from '../../api/tax.api';

function Invoice() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [invoice, setInvoice] = useState({} as any);
    let { id } = useParams();
    const [taxes, setTaxes] = useState([] as any);

    useEffect(() => {
        getInvoice(id)
        .then(res => {
            setInvoice(res);
            setIsLoaded(true);
        }, (err) => {
            setError(err.message);
            setIsLoaded(true);
        })
    }, [id])

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
    }, [id])


    if (error) {
        return (<Typography>{error}</Typography>);
        }
    if (!isLoaded) {
        return (<Typography>Loading...</Typography>);
        }
    
    return (
        <Grid container spacing={2}>
            <Grid xs={8}>
                <Stack spacing={2}>
                    <InvoiceDetails invoice={invoice} setInvoice={setInvoice} taxes={taxes}/>
                </Stack>
            </Grid>
            <Grid xs={4}>
                <Stack spacing={2}>
                    <Contact client={invoice?.invoice.client}/>
                    <Notes client={invoice?.invoice.client} />
                </Stack>
            </Grid>
        </Grid>
    )
}

export default Invoice;