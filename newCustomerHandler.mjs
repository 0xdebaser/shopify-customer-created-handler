import { Client, Environment } from "square";

// IMPORTANT NOTE: Data structure is quite different in different Shopify webhooks.
// This module is designed especially for the "Customer Created" webhook.

export default async function newCustomerHandler(data) {
  let squareClient;
  try {
    if (!squareClient)
      squareClient = new Client({
        bearerAuthCredentials: { accessToken: process.env.SQUARE_ACCESS_TOKEN },
        environment: Environment.Production,
      });
    const newCustomerEmail = data.email.trim();
    const response = await squareClient.customersApi.searchCustomers({
      query: {
        filter: {
          emailAddress: {
            exact: newCustomerEmail,
          },
        },
      },
    });

    // Is customer already in Square?
    if (response.result.hasOwnProperty("customers")) {
      console.log(
        `Customer with email address ${customer.email} already exists in Square.`
      );
    } else {
      // If not, make a new customer
      const response1 = await squareClient.customersApi.createCustomer({
        emailAddress: newCustomerEmail,
        familyName: data.last_name,
        givenName: data.first_name,
      });
      squareCustomerId = response1.result.customer.id;
      console.log(
        `New customer created for ${newCustomerEmail}: Square Customer Id: ${squareCustomerId}`
      );
    }
    return squareCustomerId;
  } catch (error) {
    console.log(error);
    return false;
  }
}
