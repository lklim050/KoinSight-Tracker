import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";

export function TableList() {
  return (
    <div className="overflow-x-auto">
      <Table className="w-full">
        <TableHead>
          <TableRow>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Price</TableHeadCell>
            <TableHeadCell>24h%</TableHeadCell>
            <TableHeadCell>7d%</TableHeadCell>
            <TableHeadCell>Holdings</TableHeadCell>
            <TableHeadCell>Avg.Buy Price</TableHeadCell>
            <TableHeadCell>Profit/Loss</TableHeadCell>
            <TableHeadCell className="text-right">Action</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Bitcoin
            </TableCell>
            <TableCell>$70,000(mock)</TableCell>
            <TableCell>12%</TableCell>
            <TableCell>3%</TableCell>
            <TableCell>$2,234.21</TableCell>
            <TableCell>$40,000</TableCell>
            <TableCell>$5,000(green)</TableCell>
            <TableCell className="text-right">
              <a
                href="#"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Edit
              </a>
            </TableCell>
          </TableRow>
          <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Ethereum
            </TableCell>
            <TableCell>$70,000(mock)</TableCell>
            <TableCell>12%</TableCell>
            <TableCell>3%</TableCell>
            <TableCell>$2,234.21</TableCell>
            <TableCell>$40,000</TableCell>
            <TableCell>$5,000(green)</TableCell>
            <TableCell className="text-right">
              <a
                href="#"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Edit
              </a>
            </TableCell>
          </TableRow>
          <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Dogecoin
            </TableCell>
            <TableCell>$70,000(mock)</TableCell>
            <TableCell>12%</TableCell>
            <TableCell>3%</TableCell>
            <TableCell>$2,234.21</TableCell>
            <TableCell>$40,000</TableCell>
            <TableCell>$5,000(green)</TableCell>
            <TableCell className="text-right">
              <a
                href="#"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Edit
              </a>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
