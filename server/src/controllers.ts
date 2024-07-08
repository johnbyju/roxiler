import express, { Request, Response } from "express";
import axios from "axios";
import { apiData } from "./schema";

// Add seeding data to database
export const insertThirdApi = async (req: Request, res: Response) => {
  try {
    const { data } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    await apiData.insertMany(data);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

// List all transactions with search and pagination
export const listTransactions = async (req: Request, res: Response) => {
  const { month, page = 1, perPage = 10, search = '' } = req.query;
  const regex = new RegExp(search as string, 'i'); // Creating case-insensitive regex

  try {
    // Parse month into a number (assuming it's a string from req.query)
    const targetMonth = parseInt(month as string);

    // Validate month
    if (isNaN(targetMonth) || targetMonth < 1 || targetMonth > 12) {
      return res.status(400).send('Invalid month');
    }

    // Define start and end date based on the parsed month
    const startDate = new Date(`2023-${String(targetMonth).padStart(2, '0')}-01T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setSeconds(endDate.getSeconds() - 1);

    // Define an array to hold $or conditions based on search fields
    const orConditions: any[] = [];

    // Check if search criteria are provided and add corresponding conditions
    if (search) {
      orConditions.push(
        { title: { $regex: regex, $options: 'i' } },
        { description: { $regex: regex, $options: 'i' } }
        // Removing price search using regex as it's not a common practice
      );
    }

    // Query transactions based on date range and/or search conditions
    const query: any = {
      dateOfSale: { $gte: startDate, $lte: endDate }
    };

    if (orConditions.length > 0) {
      query.$or = orConditions;
    }

    const transactions = await apiData.find(query)
      .skip((+page - 1) * +perPage)
      .limit(+perPage);

    // Count total documents based on the same query conditions
    const total = await apiData.countDocuments(query);

    res.json({ total, transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.sendStatus(500);
  }
};

// Testing API for data view
export const showAllData = async (req: Request, res: Response) => {
  try {
    const allDocuments = await apiData.find({}); // Fetch all documents without any specific conditions
    console.log('All Documents:', allDocuments); // Log all documents to the console

    // Optionally, send all documents as a JSON response
    res.json(allDocuments);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).send('Error fetching documents');
  }
};

// Get statistics for a specific month
export const getStatistics = async (req: Request, res: Response) => {
  const { month } = req.query;

  try {
    // Parse month into a number (assuming it's a string from req.query)
    const targetMonth = parseInt(month as string);

    // Validate month
    if (isNaN(targetMonth) || targetMonth < 1 || targetMonth > 12) {
      return res.status(400).send('Invalid month');
    }

    // Define start and end date based on the parsed month
    const startDate = new Date(`2023-${String(targetMonth).padStart(2, '0')}-01T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setSeconds(endDate.getSeconds() - 1);

    const totalSaleAmount = await apiData.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]);

    const totalSoldItems = await apiData.countDocuments({ dateOfSale: { $gte: startDate, $lte: endDate }, sold: true });
    const totalNotSoldItems = await apiData.countDocuments({ dateOfSale: { $gte: startDate, $lte: endDate }, sold: false });

    res.json({
      totalSaleAmount: totalSaleAmount[0]?.total || 0,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    res.status(500).send('Error fetching statistics');
  }
};

// Get bar chart data for price ranges
export const getBarChart = async (req: Request, res: Response) => {
  const { month } = req.query;

  try {
    // Parse month into a number (assuming it's a string from req.query)
    const targetMonth = parseInt(month as string);

    // Validate month
    if (isNaN(targetMonth) || targetMonth < 1 || targetMonth > 12) {
      return res.status(400).send('Invalid month');
    }

    // Define start and end date based on the parsed month
    const startDate = new Date(`2023-${String(targetMonth).padStart(2, '0')}-01T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setSeconds(endDate.getSeconds() - 1);

    const priceRanges = [
      { range: '0-100', min: 0, max: 100 },
      { range: '101-200', min: 101, max: 200 },
      { range: '201-300', min: 201, max: 300 },
      { range: '301-400', min: 301, max: 400 },
      { range: '401-500', min: 401, max: 500 },
      { range: '501-600', min: 501, max: 600 },
      { range: '601-700', min: 601, max: 700 },
      { range: '701-800', min: 701, max: 800 },
      { range: '801-900', min: 801, max: 900 },
      { range: '901-above', min: 901, max: Infinity },
    ];

    const barChartData = await Promise.all(priceRanges.map(async (range) => {
      const count = await apiData.countDocuments({
        dateOfSale: { $gte: startDate, $lte: endDate },
        price: { $gte: range.min, $lte: range.max },
      });
      return { range: range.range, count };
    }));

    res.json(barChartData);
  } catch (error) {
    res.status(500).send('Error fetching bar chart data');
  }
};

// Get combined data from all APIs
export const getCombinedData = async (req: Request, res: Response) => {
  try {
    const [transactions, statistics, barChart] = await Promise.all([
      listTransactions(req, res),
      getStatistics(req, res),
      getBarChart(req, res)
    ]);

    res.json({ transactions, statistics, barChart });
  } catch (error) {
    res.status(500).send('Error fetching combined data');
  }
};
