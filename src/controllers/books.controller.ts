import { Request, Response, NextFunction } from "express";
import booksService from "../services/books.service";
import { getReqId } from "../utils/get-req-param.util";

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    res.sendInst(await booksService.getMultiple());
  } catch (err: any) {
    console.error(`Error while getting books`, err.message);
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const bookId = getReqId(req);
    res.sendInst(await booksService.getById(bookId));
  } catch (err: any) {
    console.error(`Error while getting book`, err.message);
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    res.sendInst(await booksService.createBook(req.body));
  } catch (err: any) {
    console.error(`Error while creating book`, err.message);
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const bookId = getReqId(req);
    res.sendInst(await booksService.updateBook(bookId, req.body));
  } catch (err: any) {
    console.error(`Error while updating book`, err.message);
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const bookId = getReqId(req);
    res.sendInst(await booksService.removeById(bookId));
  } catch (err: any) {
    console.error(`Error while deleting book`, err.message);
    next(err);
  }
}
