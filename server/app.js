require("./mongodb");
const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const { ApolloServer } = require("apollo-server-koa");
const { typeDefs, resolvers } = require("./graphql/schema");
const app = new Koa();
const router = new Router();
const apollo = new ApolloServer({ typeDefs, resolvers });

app.use(cors());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(apollo.getMiddleware());

app.listen(5000, () => {
  console.log(`🚀 Server ready at http://localhost:5000${apollo.graphqlPath}`);
});
