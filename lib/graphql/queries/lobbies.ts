// import { gql } from 'graphql-request';
import { graphql } from "../generated";

export const GET_LOBBIES = graphql(`
  query GetLobbies($filter: LobbyFilterInput, $pagination: PaginationInput) {
    lobbies(filter: $filter, pagination: $pagination) {
      lobbyId
      title
      status
      createdAt
      players {
        playerId
        username
      }
    }
  }
`);