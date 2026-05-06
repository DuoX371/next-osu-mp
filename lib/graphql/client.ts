import { GraphQLClient } from "graphql-request"

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export function getGqlClient() {
    return new GraphQLClient(`${apiUrl}/graphql`, {
        headers: {
            "x-nonce": Date.now().toString()
        }
    });
}