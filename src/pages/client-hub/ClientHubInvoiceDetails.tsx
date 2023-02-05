import { Box, Button, Card, Chip, Divider, Grid, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import EmptyState from '../../shared/EmptyState';
import PaymentModal from './PaymentModal';

function add(accumulator: number, a: number) {
    return (+accumulator) + (+a);
  }

function InvoiceItemSaved(props: any) {
    return (
        <Box sx={{ px: 4 }}>
          <Grid container spacing={2} marginTop={2}>
            <Grid item={true} xs={4}>
              <Stack spacing={1.5}>
                <Typography variant="body2" color="neutral.light" fontWeight={500}>
                  Service
                </Typography>
                <Typography variant="body2" color="neutral.main" fontWeight={600}>
                  {props.item.title}
                </Typography>
              </Stack>
            </Grid>
            <Grid item={true} xs={4}></Grid>
            <Grid item={true} xs={4}>
              <Stack spacing={1.5} alignItems="flex-end">
                <Typography variant="body2" color="neutral.light" fontWeight={500}>
                  Total
                </Typography>
                <Typography variant="body2" color="neutral.main" fontWeight={600}>
                  ${(props.item.price).toFixed(2)}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          <Stack marginTop={3}>
            <Typography variant="body2" color="neutral.light">
              Description
            </Typography>
            <Divider />
            <Typography
              variant="body2"
              color="neutral.main"
              dangerouslySetInnerHTML={{ __html: props.item.description }}
            ></Typography>
          </Stack>
        </Box>
      );
}


function ClientHubInvoiceDetails(props: any) {
    // const [error, setError] = useState(null);
    // const [loading, setLoading] = useState(false);
    const [paymentOpen, setPaymentOpen] = useState(false);

    const handlePaymentClose = (value: string) => {
        setPaymentOpen(false);
    };

    const handleOpenPayment = () => {
        setPaymentOpen(true);
    }

    return (
        <Stack spacing={2}>
          <Card sx={{ pb: 4, pt: 1 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              marginBottom={2}
            >
              <Typography variant="h6" fontWeight={600}>
                {`Invoice #${props.invoice.invoice.id}`}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Stack spacing={2}>
                <Typography
                  textAlign="center"
                  variant="body2"
                  fontWeight={500}
                  color="neutral.light"
                >
                  Client
                </Typography>
                <Typography textAlign="center" variant="body2">
                  Jim Halpert
                </Typography>
              </Stack>
              <Stack spacing={2}>
                <Typography
                  textAlign="center"
                  variant="body2"
                  fontWeight={500}
                  color="neutral.light"
                >
                  Sent
                </Typography>
                <Typography textAlign="center" variant="body2">
                  11/27/2022
                </Typography>
              </Stack>
              <Stack spacing={2}>
                <Typography
                  textAlign="center"
                  variant="body2"
                  fontWeight={500}
                  color="neutral.light"
                >
                  Opened
                </Typography>
                  <Typography textAlign="center" variant="body2">
                  11/27/2022
                  </Typography>
              </Stack>
              <Stack spacing={1}>
                <Typography
                  textAlign="center"
                  variant="body2"
                  fontWeight={500}
                  color="neutral.light"
                >
                  Status
                </Typography>
                <Chip label={props.invoice.invoice.status} color="primary" />
              </Stack>
            </Stack>
          </Card>
          <Card sx={{ py: 3 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6" fontWeight={600}>
                Invoice Details
              </Typography>
            </Stack>
            <Divider sx={{ mt: 3, mb: 1 }} />
                {props.invoice.items.map((item: any, index: number) => (
                  <InvoiceItemSaved key={index} item={item} {...props} />
                ))}
                {props.invoice?.items?.length === 0 && (
                  <EmptyState type="invoice-items" />
                )}
            <Stack mt={2.5} spacing={2}>
              <Grid container justifyContent="flex-end">
                <Grid item xs={4}>
                  <Grid container>
                    <Grid item xs={5}>
                      <Typography variant="body2" color="primary" fontWeight={600}>
                        Subtotal
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="neutral.main"
                      >
                        $
                        {(props.invoice.items
                          .map((i: any) => i.price)
                          .reduce(add, 0)).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container justifyContent="flex-end">
                <Grid item xs={4}>
                  <Grid container alignItems="center">
                    <Grid item xs={5}>
                      <Typography
                        variant="body2"
                        color="neutral.light"
                        fontWeight={500}
                      >
                        Taxes
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="neutral.main"
                        >
                          {(+(
                            props.taxes.find(
                              (t: any) => t.id === props.invoice.invoice.tax
                            )?.tax ?? 0
                          ) *
                            props.invoice.items
                              .map((i: any) => i.price)
                              .reduce(add, 0)).toFixed(2)}
                        </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container justifyContent="flex-end">
                  <Grid item xs={5}>
                    <Divider sx={{ width: '100%' }} />
                  </Grid>
                </Grid>
              <Grid container justifyContent="flex-end">
                <Grid item xs={4}>
                  <Grid container>
                    <Grid item xs={5}>
                      <Typography variant="h6" color="primary" fontWeight={700}>
                        Total
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        color="neutral.main"
                      >
                        $
                        {((+props.invoice.items.map((i: any) => i.price).reduce(add, 0)) + (+props.invoice.items.map((i: any) => i.price).reduce(add, 0))*(+props.taxes.find((t: any) => t.id === props.invoice.invoice.tax)?.tax ?? 0)).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container justifyContent="flex-end">
                <Grid item xs={4}>
                  <Grid container>
                    <Grid item xs={5}>
                      <Typography variant="body2" color="neutral.light" fontWeight={600}>
                        Balance
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="neutral.main"
                      >
                        $
                        {((+props.invoice.items.map((i: any) => i.price).reduce(add, 0)) + (+props.invoice.items.map((i: any) => i.price).reduce(add, 0))*(+props.taxes.find((t: any) => t.id === props.invoice.invoice.tax)?.tax ?? 0)
                        - props.payments.map((p: any) => p.amount).reduce(add, 0)).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Stack>
            {props.payments.length > 0 && (
              <>
                  <Stack mt={2.5} spacing={2}>
                      {props.payments.map((payment: any) => (
                            <Grid key={payment.id} container justifyContent="flex-end">
                            <Grid item xs={4}>
                              <Grid container alignItems="center">
                                <Grid item xs={8}>
                                  <Typography
                                    variant="body2"
                                    color="neutral.light"
                                    fontWeight={500}
                                  >
                                    {`${payment.type} collected ${dayjs(payment.transDate).format('MMM D')}`}
                                  </Typography>
                                </Grid>
    
                                <Grid item xs={4}>
                                    <Typography
                                      variant="body2"
                                      fontWeight={600}
                                      color="neutral.main"
                                    >
                                      ${(+payment?.amount)?.toFixed(2)}
                                    </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                      ))}
                  </Stack>
              </>
            )}
            {props.invoice.invoice.status === 'Awaiting Payment' && 
            <>
                <Button
                onClick={handleOpenPayment}
                >Pay Invoice
                </Button>
            </>
                }
            <PaymentModal
            open={paymentOpen}
            onClose={handlePaymentClose}
            success={props.success}
            invoice={props.invoice}
            type='payment'
            amount={((+props.invoice.items.map((i: any) => i.price).reduce(add, 0)) + (+props.invoice.items.map((i: any) => i.price).reduce(add, 0))*(+props.taxes.find((t: any) => t.id === props.invoice.invoice.tax)?.tax ?? 0)
                - props.payments.map((p: any) => p.amount).reduce(add, 0)).toFixed(2)}
            />
          </Card>
        </Stack>
      );
}

export default ClientHubInvoiceDetails;