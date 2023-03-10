import { createNymMixnetClient, MimeTypes } from "@nymproject/sdk-commonjs";

export async function createNymClient() {
  let nymRecipient;
  // start the web worker
  const nym = await createNymMixnetClient();
  // add nym client to the Window globally, so that it can be used from the dev tools console
  window.nym = nym;

  if (!nym) {
    console.error('Oh no! Could not create client');
    return;
  }
  // subscribe to connect event, so that we can show the client's address
  nym.events.subscribeToConnected((e) => {
    if (e.args.address) {
      nymRecipient = e.args.address
      console.log("WASM client address inside MM: " +nymRecipient);
    }
  });
  const nymSPClientAddress = 'H5PDeFvW2rwZiFhJ8295HvAkCdrLBfkwEv51XkEKTWKv.Gw5LreC7EJvZrqE5o5xt5AYyC5qT8K4LVG9VYQxeUE2m@62F81C9GrHDRja9WCqozemRFSzFPMecY85MbGwn6efve';

  // initialise NYM client
  const nymApiUrl = 'https://validator.nymtech.net/api';
  const preferredGatewayIdentityKey = 'E3mvZTHQCdBvhfr178Swx9g4QG3kkRUun7YnToLMcMbM';
  await nym.client.start({ nymApiUrl, clientId: 'METAMASK wallet',preferredGatewayIdentityKey, });
  // sleep to allow the client to start up
  await new Promise(resolve => setTimeout(resolve, 5000));

  // send wasm client address
  await nym.client.send({ payload: { message: JSON.stringify(nymRecipient), mimeType: MimeTypes.TextPlain }, recipient: nymSPClientAddress })
  await new Promise(resolve => setTimeout(resolve, 5000));

  return { nym, nymSPClientAddress };
}

export function getNymSPClientAddress() {
  return 'H5PDeFvW2rwZiFhJ8295HvAkCdrLBfkwEv51XkEKTWKv.Gw5LreC7EJvZrqE5o5xt5AYyC5qT8K4LVG9VYQxeUE2m@62F81C9GrHDRja9WCqozemRFSzFPMecY85MbGwn6efve';
}