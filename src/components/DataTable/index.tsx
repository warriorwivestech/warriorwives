"use client";

import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  Badge,
} from "@chakra-ui/react";

export default function DataTable() {
  return (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>Imperial to metric conversion factors</TableCaption>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th textAlign="end">Archived</Th>
            <Th textAlign="end">Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Testing</Td>
            <Td>testing</Td>
            <Td textAlign="end">
              <Badge colorScheme="green">Yes</Badge>
            </Td>
            <Td textAlign="end">
              <Button>View group</Button>
            </Td>
          </Tr>
          <Tr>
            <Td>Testing</Td>
            <Td>testing</Td>
            <Td textAlign="end">
              <Badge colorScheme="red">No</Badge>
            </Td>
            <Td textAlign="end">
              <Button>View group</Button>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
}
