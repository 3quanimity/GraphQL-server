import axios from 'axios';
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';

// // Hardcoded data
// const customers = [
//   { id: '1', name: 'John Doe', email: 'jdoe@gmail.com', age: 35 },
//   { id: '2', name: 'Steve Smith', email: 'steve@gmail.com', age: 25 },
//   { id: '3', name: 'Sara Williams', email: 'sara@gmail.com', age: 32 }
// ];

// Customer Type
const CustomerType = new GraphQLObjectType({
  name: 'Customer',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt }
  })
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    customer: {
      type: CustomerType,
      description: 'a single customer',
      args: {
        id: { type: GraphQLID }
      },
      resolve: (parent, args) =>
        // customers.find(customer => customer.id == args.id)
        axios
          .get('http://localhost:3000/customers/' + args.id)
          .then(res => res.data)
    },

    customers: {
      type: GraphQLList(CustomerType),
      description: 'a list of customers',
      resolve: () =>
        axios.get('http://localhost:3000/customers/').then(res => res.data)
    }
  }
});

// Mutations
const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    //ADD
    addCustomer: {
      type: CustomerType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: (parent, args) => {
        return axios
          .post('http://localhost:3000/customers', {
            name: args.name,
            email: args.email,
            age: args.age
          })
          .then(res => res.data);
      }
    },

    //DELETE
    deleteCustomer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) }
      },
      resolve: (parent, args) => {
        return axios
          .delete('http://localhost:3000/customers/' + args.id)
          .then(res => res.data);
      }
    },

    //UPDATE
    editCustomer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve: (parent, args) => {
        return axios
          .patch('http://localhost:3000/customers/' + args.id, args)
          .then(res => res.data);
      }
    }
  }
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});
