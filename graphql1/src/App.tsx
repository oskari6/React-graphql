import { useEffect, useState } from "react";
import "./App.css";
import { useQuery, useMutation, gql } from "@apollo/client";
import AddOrder from "./components/AddOrder";
//test

export type Order = {
  id: number;
  description: string;
  totalInCents: number;
};

export type Customer = {
  id: number;
  name: string;
  industry: string;
  orders: Order[];
};

const GET_DATA = gql`
  {
    customers {
      id
      name
      industry
      orders {
        id
        description
        totalInCents
      }
    }
  }
`;

const MUTATE_DATA = gql`
  mutation MUTATE_DATA($name: String!, $industry: String!) {
    createCustomer(name: $name, industry: $industry) {
      customer {
        id
        name
      }
    }
  }
`;

function App() {
  const [name, setName] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const { loading, error, data } = useQuery(GET_DATA);
  const [
    createCustomer,
    {
      loading: createCustomerLoading,
      error: createCustomerError,
      data: createCustomerData,
    },
  ] = useMutation(MUTATE_DATA, {
    refetchQueries: [{ query: GET_DATA }],
  });

  useEffect(() => {
    console.log(loading, error, data);
    console.log(createCustomerLoading, createCustomerError, createCustomerData);
  });
  return (
    <div className="App">
      <h1>Customers</h1>
      {error ? <p>Something went wrong</p> : null}
      {loading ? <p>loading...</p> : null}
      {data
        ? data.customers.map((customer: Customer) => {
            return (
              <div key={customer.id}>
                <h2> {customer.name + " (" + customer.industry + ") "}</h2>
                {customer.orders.map((order: Order) => {
                  return (
                    <div key={order.id}>
                      <p>{order.description}</p>
                      <p>
                        Cost: $
                        {(order.totalInCents / 100).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  );
                })}
                <AddOrder customerId={customer.id} />
              </div>
            );
          })
        : null}
      <h3>Add a Customer</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createCustomer({ variables: { name: name, industry: industry } });
          if (!error) {
            setName("");
            setIndustry("");
          }
        }}
      >
        <div>
          <label htmlFor="name">Name: </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <br />
        <div>
          <label htmlFor="industry">Industry: </label>
          <input
            id="industry"
            type="text"
            value={industry}
            onChange={(e) => {
              setIndustry(e.target.value);
            }}
          />
        </div>
        <br />
        <button disabled={createCustomerLoading ? true : false}>
          Add Customer
        </button>
        {createCustomerError ? <p>Error creating customer</p> : null}
      </form>
    </div>
  );
}

export default App;
