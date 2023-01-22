import { AddressAutofill } from '@mapbox/search-js-react';
import { AddCircleOutlineOutlined, EmailOutlined, PersonOutline, PhoneOutlined } from '@mui/icons-material';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, Stack, Step, StepLabel, Stepper, TextField } from '@mui/material';
import mapboxgl from 'mapbox-gl';
import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import RegexParser from 'regex-parser';
import { createClient } from '../../api/client.api';
import { createProperty } from '../../api/property.api';

mapboxgl.accessToken = 'pk.eyJ1IjoiY3V0dGluZ2VkZ2Vjcm0iLCJhIjoiY2xjaHk1cWZrMmYzcDN3cDQ5bGRzYTY1bCJ9.0B4ntLJoCZzxQ0SUxqaQxg';

  
export default function NewClient(props: any) {
    const [contact, setContact] = useState({contacts: [{type: 'phone', content: ''}, {type: 'email', content: ''}]} as any);
    const [property, setProperty] = useState({} as any);
    const [activeStep, setActiveStep] = useState(0);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    const handleCancel = () => {
        props.onClose();
        setContact({contacts: [{type: 'phone', content: ''}, {type: 'email', content: ''}]});
        setProperty({});
      };
  
      const handleSave = () => {
        let contacts = contact.contacts?.filter((con: any) => con.content.length > 0)
        setContact({...contact, contacts: contacts});
        createClient(contact)
        .then(res => {
          if (propValid()) {
            createProperty({client: res.id, ...property})
            .then(propRes => {
              navigate(`/clients/${res.id}`);
              props.success('Client created successfully');
            }, (propErr) => {
              setError(propErr.message);
            })
          } else {
            navigate(`/clients/${res.id}`);
            props.success('Client created successfully');
          }
        }, (err) => {
          setError(err.message);
        })
      };

      const propValid = () => {
        return Object.keys(property)?.filter(k => !!property[k]?.trim()).length > 0;
      }
  
      const handleChange = (event: any) => {
        setContact({ ...contact, [event.target.id]: event.target.value.trim()});
      };

      const handleChangeProperty = (event: any) => {
        setProperty({ ...property, [event.target.id]: event.target.value.trim()});
      };

      const handleChangePhone = (event: any, index: number) => {
        let contacts = contact?.contacts?.filter((c: any) => c.type === 'phone');
        contacts[index].content = event.target.value;
        contacts = contacts.concat(contact?.contacts?.filter((c: any) => c.type === 'email'));
        setContact({...contact, contacts: contacts});
      }
  
      const handleRemovePhone = (event: any, index: number) => {
        let contacts = contact?.contacts?.filter((c: any) => c.type === 'phone');
        contacts = contacts.slice(undefined, index).concat(contacts.slice(index+1, undefined));
        contacts = contacts.concat(contact?.contacts?.filter((c: any) => c.type === 'email'));
        setContact({...contact, contacts: contacts});
      }
  
      const handleAddPhone = (event: any) => {
        let contacts = contact.contacts;
        contacts.push({type: 'phone', content: ''})
        setContact({...contact, contacts: contacts});
      }
  
      const handleChangeEmail = (event: any, index: number) => {
        let contacts = contact?.contacts?.filter((c: any) => c.type === 'email');
        contacts[index].content = event.target.value;
        contacts = contacts.concat(contact?.contacts?.filter((c: any) => c.type === 'phone'));
        setContact({...contact, contacts: contacts});
      }
  
      const handleRemoveEmail = (event: any, index: number) => {
        let contacts = contact?.contacts?.filter((c: any) => c.type === 'email');
        contacts = contacts.slice(undefined, index).concat(contacts.slice(index+1, undefined));
        contacts = contacts.concat(contact?.contacts?.filter((c: any) => c.type === 'phone'));
        setContact({...contact, contacts: contacts});
      }
  
      const handleAddEmail = (event: any) => {
        let contacts = contact.contacts;
        contacts.push({type: 'email', content: ''})
        setContact({...contact, contacts: contacts});
      }

      let phoneNumbers: any = []
      let emailAddresses: any = []

      const handleNext = () => {  
        setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
      };
    
      const handleBack = () => {
        setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
      };

      const validInput = () => {
        return ((contact.contacts?.filter((con: any) => con.content?.length > 4).length > 0 || contact.first?.trim().length > 1 || contact.last?.trim().length > 1))
         && (contact.contacts?.filter((email: any) => email.type==='email')?.filter((email: any) => !emailValid(email.content) && email.content.trim().length > 0).length === 0);
      }
  
      const emailValid = (email: any) => {
        // eslint-disable-next-line
        let validEmail = RegexParser("/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.");
        return validEmail.test(email);
      }

      phoneNumbers = contact?.contacts?.filter((c: any) => c.type === 'phone')?.map((phone: any, index: any) => {
        return (
            <TextField
            key={index}
            label="Phone"
            type={"tel"}
            value={phone.content}
            onChange={(e) => handleChangePhone(e, index)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneOutlined />
                </InputAdornment>
              ),
              endAdornment: (
                <Button
                onClick={(e) => handleRemovePhone(e,index)}
                >Remove
                </Button>
              )
            }} />
        );
      })

      emailAddresses = contact?.contacts?.filter((c: any) => c.type === 'email')?.map((email: any, index: any) => {
        return (
            <TextField
            key={index}
            label="Email"
            type={"email"}
            value={email.content}
            onChange={(e) => handleChangeEmail(e, index)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined />
                </InputAdornment>
              ),
              endAdornment: (
                <Button
                onClick={(e) => handleRemoveEmail(e,index)}
                >Remove
                </Button>
              )
            }} />
        );
      })

    return (
      <Dialog onClose={handleCancel} open={props.open}>
        <DialogTitle>Create new client</DialogTitle>
        <DialogContent>
        <Box sx={{ width: '100%' }}>
        <Stepper activeStep={activeStep}>
            <Step>
                <StepLabel>Client Info</StepLabel>
            </Step>
            <Step>
                <StepLabel>Property Info</StepLabel>
            </Step>
        </Stepper>
            <React.Fragment>
                {activeStep === 0 ? (
                <Stack spacing={2}>
                  <Stack direction={'row'}>
                  <TextField
                    id="first" 
                    label="First name"
                    defaultValue={contact.first ? contact.first : undefined}
                    onChange={handleChange}
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <PersonOutline />
                        </InputAdornment>
                        ),
                    }}
                    />
                    <TextField
                    id="last" 
                    label="Last name"
                    defaultValue={contact.last ? contact.last : undefined}
                    onChange={handleChange}
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <PersonOutline />
                        </InputAdornment>
                        ),
                    }}
                    />
                  </Stack>
                    {phoneNumbers}
                    <Button onClick={handleAddPhone} startIcon={<AddCircleOutlineOutlined />}>Add Phone Number</Button>
                    {emailAddresses}
                    <Button onClick={handleAddEmail} startIcon={<AddCircleOutlineOutlined />}>Add Email Address</Button>
                </Stack>
                ) : (
                    <form>
                    <AddressAutofill accessToken={mapboxgl.accessToken}>
                      <Stack spacing={2}>
                          <TextField
                          id="address" 
                          label="Address"
                          autoComplete='street-address'
                          defaultValue={property.address ? property.address : undefined}
                          onChange={handleChangeProperty}
                          />
                          <TextField
                          id="address2" 
                          label="Unit"
                          defaultValue={property.address2 ? property.address2 : undefined}
                          onChange={handleChangeProperty}
                          />
                          <Stack direction='row'>
                            <TextField
                            id="city" 
                            label="City"
                            autoComplete='address-level2'
                            defaultValue={property.city ? property.city : undefined}
                            onChange={handleChangeProperty}
                            />
                            <TextField
                            id="state" 
                            label="State/Province"
                            autoComplete='address-level1'
                            defaultValue={property.state ? property.state : undefined}
                            onChange={handleChangeProperty}
                            />
                          </Stack>
                          <Stack direction='row'>
                            <TextField
                            id="zip" 
                            label="Postal"
                            autoComplete='postal-code'
                            defaultValue={property.zip ? property.zip : undefined}
                            onChange={handleChangeProperty}
                            />
                            <TextField
                            id="country" 
                            label="Country"
                            autoComplete='country-name'
                            defaultValue={property.country ? property.country : undefined}
                            onChange={handleChangeProperty}
                            />
                          </Stack>
                      </Stack>
                    </AddressAutofill>
                    </form>
                )}
            </React.Fragment>
        </Box>

        </DialogContent>
        <DialogActions>
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
                >
                Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                {activeStep === 1 ? (
                <Button
                disabled={!validInput}
                onClick={handleSave}>
                    Create
                </Button>
                ) : (
                <Button
                onClick={handleNext}
                disabled={!validInput()}
                >
                    Next
                </Button>
                )}
            </Box>
        </DialogActions>
        {error && <Alert severity="error">{error}</Alert>}
      </Dialog>
    );
  }
  