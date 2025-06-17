import { execute, parse } from "graphql";
import { typeDefs } from "../Utils/schema";
import { resolvers } from "../Utils/resolvers";
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