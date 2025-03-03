import { MessageDto } from "@/types.index";
import { Card } from "@heroui/card";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import MessageTableCell from "./message-table.cell";
import { useMessages } from "@/hooks/use-messages";
import { Key } from "node:readline";

type Props = {
  initialMessages: MessageDto[];
};

export default function MessageTable({ initialMessages }: Props) {
  const { columns, isOutbox, isDeleting, deleteMessage, selectRow, messages } = useMessages(initialMessages)

  return (
    <Card shadow="none" className="flex flex-col gap-3 h-[80dvh] overflow-auto w-full">
      <Table aria-label="messages table" selectionMode="single" onRowAction={(key) => selectRow(key as Key)} shadow="none">
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={messages}>
          {(item) => (
            <TableRow key={item.id} className="cursor-pointer">
              {(columnKey) => (
                <TableCell className={`${!item.dateRead && !isOutbox ? 'font-semibold' : ''}`}>
                  <MessageTableCell item={item} columnKey={columnKey as string} isOutbox={isOutbox} deleteMessage={deleteMessage} isDeleting={isDeleting.loading && isDeleting.id === item.id} />
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card >
  );
}
