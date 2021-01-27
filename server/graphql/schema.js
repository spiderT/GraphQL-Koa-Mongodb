const { gql } = require("apollo-server-koa");
const mongoose = require("mongoose");

const StudentModel = mongoose.model("Student");

const typeDefs = gql`
  type Student {
    name: String
    sex: String
    age: Int
    phone: String
    major: String
    grade: String
    _id: ID
  }
  type Query {
    getStudent: [Student]
  }
  type Mutation {
    addStudent(post: StudentInput): Student
  }

  input StudentInput {
    name: String
    sex: String
    age: Int
    phone: String
    major: String
    grade: String
  }
`;

const resolvers = {
  Query: {
    getStudent: (parent, args, context, info) => {
      return StudentModel.find({});
    },
  },
  Mutation: {
    addStudent: (parent, args, context) => {
      const { name, sex, age, phone, major, grade } = args.post;
      return StudentModel.create({ name, sex, age, phone, major, grade });
    },
  },
};

module.exports = {
  resolvers,
  typeDefs,
};
