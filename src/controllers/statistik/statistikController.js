import prisma from "../../config/prisma.js";
import { successResponse, errorResponse } from "../../utils/response.js";

export const getRange = async (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) {
    return errorResponse(res, "Start and end dates are required", 400);
  }

  const data = await prisma.statistik.findMany({
    where: {
      date: {
        gte: new Date(start),
        lte: new Date(end),
      },
    },
  });

  const totalPesanan = data.reduce((sum, inv) => sum + 1, 0);
  const totalTerbayar = data.reduce((sum, inv) => sum + inv.total, 0);

  return successResponse(res, "Statistik fetched successfully", {
    totalPesanan,
    totalTerbayar,
  });
};

export const getSingle = async (req, res) => {
  const { date } = req.query;
  const target = new Date(date);
  const nextDay = new Date(target);
  nextDay.setDate(target.getDate() + 1);

  if (!date) {
    return errorResponse(res, "Date is required", 400);
  }

  const data = await prisma.invoice.findMany({
    where: {
      date: {
        gte: target,
        lt: nextDay,
      },
    },
  });

  //   console.log(data);

  const totalPesanan = data.length;
  const totalTerbayar = data.reduce((sum, inv) => sum + inv.total, 0);

  return successResponse(res, "Statistik fetched successfully", {
    totalPesanan,
    totalTerbayar,
  });
};
