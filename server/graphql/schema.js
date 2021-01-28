const { gql } = require("apollo-server-koa");
const utils = require("../utils");
const mongoose = require("mongoose");

const StudentModel = mongoose.model("Student");

const typeDefs = gql`
  type Time {
    createdAt: String
    updatedAt: String
  }
  type Student {
    name: String
    sex: String
    age: Int
    phone: String
    major: String
    grade: String
    meta: Time
    _id: ID
  }

  type StudentResult {
    data: [Student]
    count: Int
    pageNo: Int
    pageSize: Int
  }

  type Query {
    getStudent(
      pageNo: Int
      pageSize: Int
      name: String
      grade: String
      major: String
      age: Int
    ): StudentResult
  }

  type Mutation {
    addStudent(post: StudentInput): StudentResult
    deleteStudent(delete: StudentDelete): StudentResult
    editStudent(post: StudentEdit): StudentResult
  }

  input StudentInput {
    name: String
    sex: String
    age: Int
    phone: String
    major: String
    grade: String
  }

  input StudentDelete {
    _id: ID
  }

  input StudentEdit {
    name: String
    sex: String
    age: Int
    phone: String
    major: String
    grade: String
    _id: ID
  }
`;

const resolvers = {
  Query: {
    getStudent: async (parent, args) => {
      console.log("args", args);
      const { pageNo = 0, pageSize = 10, name, grade, major, age } = args;
      // 过滤掉对象参数值为""、null、undefined
      const condition = utils.dealObjectValue({ name, grade, major, age });
      const count = await StudentModel.collection.countDocuments(condition);
      const data = StudentModel.find(condition)
        .sort({ _id: -1 }) //  1 为升序排列，而-1是用于降序排列.
        .skip(pageNo * pageSize) // 分页
        .limit(pageSize);
      console.log("count, data", count, data);
      return { count, data, pageNo, pageSize };
    },
  },
  Mutation: {
    addStudent: (parent, args) => {
      const { name, sex, age, phone, major, grade } = args.post;
      return StudentModel.create({ name, sex, age, phone, major, grade });
    },
    deleteStudent: (parent, args) => {
      const { _id } = args.delete;
      return StudentModel.remove({ _id });
    },
    editStudent: (parent, args) => {
      const { _id, ...value } = args.post;
      return StudentModel.findOneAndUpdate({ _id }, value);
    },
  },
};

module.exports = {
  resolvers,
  typeDefs,
};
