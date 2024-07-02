import db from "./db.service";
import { BookModel } from "../models/book.model";
import { Exception } from "../models/exception.model";
import { StatusCodes } from "http-status-codes";

export async function getMultiple() {
  const books = await db.book.findMany({ include: { genres: true } });
  return books.map((book) => new BookModel(book));
}

export async function getById(id: number) {
  const book = await db.book.findFirst({
    where: { id },
    include: { genres: true },
  });
  if (!book) throw new Exception(StatusCodes.NOT_FOUND);
  return new BookModel(book);
}

export async function createBook(book: BookModel) {
  const newBook = await db.book.create({
    data: {
      ...book,
      genres: {
        connectOrCreate: book?.genres?.map((genre) => ({
          where: { name: genre },
          create: { name: genre },
        })),
      },
    },
    include: { genres: true },
  });
  return new BookModel(newBook);
}

export async function updateBook(bookId: number, book: Partial<BookModel>) {
  let updateGenres = {};
  if (book.genres?.length > 0) {
    const existGenres = (
      await db.book.findFirst({
        where: { id: bookId },
        include: { genres: true },
      })
    ).genres;
    updateGenres = {
      disconnect: existGenres
        .filter((genre) => !book.genres.includes(genre.name))
        .map((genre) => ({ id: genre.id })),
      connectOrCreate: book?.genres?.map((genre) => ({
        where: { name: genre },
        create: { name: genre },
      })),
    };
  }

  const newBook = await db.book.update({
    where: { id: bookId },
    data: {
      ...book,
      genres: updateGenres,
    },
    include: { genres: true },
  });
  if (!newBook) throw new Exception(StatusCodes.NOT_FOUND);
  return new BookModel(newBook);
}

export async function removeById(id: number) {
  const removedBook = await db.book.delete({
    where: { id },
    include: { genres: true },
  });
  return new BookModel(removedBook);
}

export default {
  getMultiple,
  getById,
  createBook,
  updateBook,
  removeById,
};
