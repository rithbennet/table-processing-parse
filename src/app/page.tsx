'use client';

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { IoMdDownload } from "react-icons/io";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableData {
  [key: string]: number;
}

export default function Home() {
  const [tableData, setTableData] = useState<TableData>({});
  const [loading, setLoading] = useState(true);
  const [firstValue, setFirstValue] = useState("");
  const [secondValue, setSecondValue] = useState("");
  const [operator, setOperator] = useState("+");
  const [customResult, setCustomResult] = useState<number | string>("N/A");

  useEffect(() => {

    fetchAndParseCSV();
  }, []);

  const fetchAndParseCSV = async () => {
    try {
      const response = await fetch('/Table Input.csv');
      const text = await response.text();
      const data: TableData = {};

      const lines = text.split('\n').filter(line => line.trim());
      lines.slice(1).forEach(line => {
        const [index, value] = line.split(',');
        if (index && value) {
          data[index.trim()] = parseInt(value.trim(), 10);
        }
      });

      setTableData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching or parsing CSV:', error);
      setLoading(false);
    }
  };


  const calculateAlpha = () => {
    if (!tableData.A5 || !tableData.A20) return 'N/A';
    return tableData.A5 + tableData.A20;
  };

  const calculateBeta = () => {
    if (!tableData.A15 || !tableData.A7) return 'N/A';
    return tableData.A15 / tableData.A7;
  };

  const calculateCharlie = () => {
    if (!tableData.A13 || !tableData.A12) return 'N/A';
    return tableData.A13 * tableData.A12;
  };

  const calculateCustom = () => {
    if (!firstValue || !secondValue || !tableData[firstValue] || !tableData[secondValue]) {
      setCustomResult("N/A");
      return;
    }

    const val1 = tableData[firstValue];
    const val2 = tableData[secondValue];

    switch (operator) {
      case "+":
        setCustomResult(val1 + val2);
        break;
      case "-":
        setCustomResult(val1 - val2);
        break;
      case "*":
        setCustomResult(val1 * val2);
        break;
      case "/":
        setCustomResult(val1 / val2);
        break;
      default:
        setCustomResult("N/A");
    }
  };

  // Handle file download
  const handleDownload = () => {
    window.open('/Table Input.csv', '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">Table Processing Application</h1>
        <p className="text-gray-600 dark:text-gray-300">CSV Data Processor and Analyzer</p>
      </header>

      <main className="flex flex-col gap-8 flex-grow w-full max-w-4xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div>
                  <CardTitle>Table 1: Raw Data</CardTitle>
                  <CardDescription>Original CSV data values</CardDescription>
                </div>
                <Button
                  onClick={handleDownload}
                  className="flex items-center gap-2"
                  variant="default"
                >
                  <IoMdDownload className="h-5 w-5" />
                  Download CSV
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Index #</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(tableData).map(([index, value]) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{index}</TableCell>
                          <TableCell>{value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custom Calculator</CardTitle>
                <CardDescription>Perform custom calculations on table values</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <Select value={firstValue} onValueChange={setFirstValue}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select first value" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(tableData).map((key) => (
                        <SelectItem key={key} value={key}>
                          {key} ({tableData[key]})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={operator} onValueChange={setOperator}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Operator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+">+ (Addition)</SelectItem>
                      <SelectItem value="-">- (Subtraction)</SelectItem>
                      <SelectItem value="*">* (Multiplication)</SelectItem>
                      <SelectItem value="/">/ (Division)</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={secondValue} onValueChange={setSecondValue}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select second value" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(tableData).map((key) => (
                        <SelectItem key={key} value={key}>
                          {key} ({tableData[key]})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm font-medium">
                    Formula: {firstValue ? firstValue : "?"} {operator} {secondValue ? secondValue : "?"}
                  </div>
                  <div className="text-lg font-bold">
                    Result: {customResult}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={calculateCustom}>Calculate</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Table 2: Processed Data</CardTitle>
                <CardDescription>Results calculated from the raw data values</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>Processing results based on the values from Table 1</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Formula</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Alpha</TableCell>
                        <TableCell>A5 + A20</TableCell>
                        <TableCell>{calculateAlpha()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Beta</TableCell>
                        <TableCell>A15 / A7</TableCell>
                        <TableCell>{calculateBeta()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Charlie</TableCell>
                        <TableCell>A13 * A12</TableCell>
                        <TableCell>{calculateCharlie()}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
                <CardDescription>Detailed breakdown of calculated values</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center border-b pb-3">
                    <dt className="font-medium sm:w-1/4">Alpha Value:</dt>
                    <dd className="text-sm text-muted-foreground">
                      <span className="text-lg font-semibold mr-2">{calculateAlpha()}</span>
                      (A5: {tableData.A5}, A20: {tableData.A20})
                    </dd>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center border-b pb-3">
                    <dt className="font-medium sm:w-1/4">Beta Value:</dt>
                    <dd className="text-sm text-muted-foreground">
                      <span className="text-lg font-semibold mr-2">{calculateBeta()}</span>
                      (A15: {tableData.A15}, A7: {tableData.A7})
                    </dd>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center">
                    <dt className="font-medium sm:w-1/4">Charlie Value:</dt>
                    <dd className="text-sm text-muted-foreground">
                      <span className="text-lg font-semibold mr-2">{calculateCharlie()}</span>
                      (A13: {tableData.A13}, A12: {tableData.A12})
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </>
        )}
      </main>

      <footer className="mt-10 py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>Table Processing App | Created with Next.js</p>
      </footer>
    </div>
  );
}
