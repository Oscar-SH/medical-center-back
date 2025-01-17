import { execute, parse } from "graphql";
import { typeDefs } from "../utils/schema";
import { resolvers } from "../utils/resolvers";
import { makeExecutableSchema } from '@graphql-tools/schema';

const schema = makeExecutableSchema({ typeDefs, resolvers });

export const executeQuery = async (query: string) => {
    const document = parse(query);
    const result = await execute({
        schema,
        document
    });

    return result;
};