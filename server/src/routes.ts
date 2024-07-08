import express from "express"

import { listTransactions,getStatistics, insertThirdApi,showAllData, getBarChart, getCombinedData } from "./controllers";

const router = express.Router()


router.post("/postedapi",insertThirdApi)
router.get('/listtransaction',listTransactions)
router.get('/showall',showAllData)
router.get('/statistics',getStatistics)
router.get('/chartdata',getBarChart)
router.get('/alldata',getCombinedData)

export default router ;