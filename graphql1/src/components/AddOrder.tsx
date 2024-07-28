import { gql, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";

export type AppProps = {
  customerId: number;
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
  mutation MUTATE_DATA(
    $description: String!
    $totalInCents: Int!
    $customer: ID
  ) {
    createOrder(
      customer: $customer
      description: $description
      totalInCents: $totalInCents
    ) {
      order {
        id
        customer {
          id
        }
        description
        totalInCents
      }
    }
  }
`;

export default function AddOrder({ customerId }: AppProps) {
  const [active, setActive] = useState(false);
  const [description, setDescription] = useState("");
  const [total, setTotal] = useState(NaN);

  const [createOrder, { loading, error, data }] = useMutation(MUTATE_DATA, {
    refetchQueries: [{ query: GET_DATA }],
  });

  useEffect(() => {
    if (data) {
      console.log(data);
      setDescription("");
      setTotal(NaN);
    }
  }, [data]);

  return (
    <div>
      {active ? null : (
        <button
          onClick={() => {
            setActive(true);
          }}
        >
          + New Order
        </button>
      )}
      {active ? (
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log(customerId, description, total);
              createOrder({
                variables: {
                  customer: customerId,
                  description: description,
                  totalInCents: total * 100,
                },
              });
            }}
          >
            <div>
              <label htmlFor="description">Description: </label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </div>
            <br />
            <div>
              <label htmlFor="total">Total: </label>
              <input
                id="total"
                type="number"
                value={isNaN(total) ? "" : total}
                onChange={(e) => {
                  setTotal(parseFloat(e.target.value));
                }}
              />
            </div>
            <br />
            {/*
            <button disabled={createCustomerLoading ? true : false}>
              Add Customer
            </button>
            {createCustomerError ? <p>Error creating customer</p> : null}*/}
            <button disabled={loading ? true : false}>Add order</button>
          </form>
          {error ? <p>Something went wrong</p> : null}
        </div>
      ) : null}
    </div>
  );
}
