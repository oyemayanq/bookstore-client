import { useEffect, useState } from "react";

import Button from "../../ui/Button";
import styles from "./CreateEditBook.module.css";
import ImageUpload from "../../ui/ImageUpload";
import { useDispatch, useSelector } from "react-redux";
import { createBook, fetchEditBookById, updateBookById } from "./bookSlice";
import Input from "../../ui/Input";
import Validator from "../../utils/validator";
import { DateRegex } from "../../utils/constants";
import { useNavigate, useSearchParams } from "react-router-dom";
import SpinnerFullPage from "../../ui/SpinnerFullPage";
import { formatDateForHTMLInput } from "../../utils/helpers";

const initialErrorValues = {
  title: "",
  authors: "",
  genres: "",
  price: "",
  publisher: "",
  publishedDate: "",
  isValid: true,
};

function CreateEditBook() {
  const [searchParams] = useSearchParams();
  const bookId = searchParams.get("bookId") || "";
  const isEditSession = Boolean(bookId);

  const {
    isLoading,
    editBook: book,
    error,
  } = useSelector((state) => state.book);

  const [bookState, setBookState] = useState({
    title: "",
    image: "",
    authors: "",
    genres: "",
    description: "",
    price: "",
    publisher: "",
    publishedDate: "",
  });
  //const [bookState, setBookState] = useState(book);
  // console.log("bookState", bookState);
  // console.log("book,", book);
  const [errors, setErrors] = useState(initialErrorValues);
  const [newChanges, setNewChanges] = useState(false);

  const { token, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (bookId && isAuthenticated) {
      dispatch(fetchEditBookById({ bookId: bookId, token }))
        .then((data) => {
          setBookState({
            title: data.payload.book.title,
            image: data.payload.book.image,
            authors: data.payload.book.authors.join(", "),
            genres: data.payload.book.genres.join(", "),
            description: data.payload.book.description,
            price: data.payload.book.price,
            publisher: data.payload.book.publisher,
            publishedDate: formatDateForHTMLInput(
              data.payload.book.publishedDate
            ),
          });
          setErrors(initialErrorValues);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setBookState({
        title: "",
        image: "",
        authors: "",
        genres: "",
        description: "",
        price: "",
        publisher: "",
        publishedDate: "",
      });
      setErrors(initialErrorValues);
    }
  }, [bookId, token, dispatch, isAuthenticated]);

  function handleChange(e) {
    //console.log(e.target.name, e.target.value);
    setNewChanges(true);

    if (e.type === "image") {
      setBookState((prevState) => ({
        ...prevState,
        image: e.value,
      }));
      setErrors((prevState) => ({ ...prevState, isValid: true }));
      return;
    }

    if (e.target.name === "price") {
      setBookState((prevState) => ({
        ...prevState,
        [e.target.name]: parseInt(e.target.value),
      }));
      setErrors((prevState) => ({ ...prevState, isValid: true }));
      return;
    }

    setBookState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    setErrors((prevState) => ({ ...prevState, isValid: true }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!newChanges) {
      return;
    }

    const enteredAuthors = bookState.authors
      .split(",")
      .map((author) => author.trim())
      .filter((a) => a.length !== 0);
    const enteredGenres = bookState.genres
      .split(",")
      .map((genre) => genre.trim())
      .filter((a) => a.length !== 0);

    const validator = new Validator();

    validator.minLength(
      "title",
      bookState.title,
      3,
      "Title should be at least 3 characters long"
    );
    validator.minSize(
      "authors",
      enteredAuthors,
      1,
      "Enter the name of at least one author"
    );
    validator.minSize("genres", enteredGenres, 1, "Enter at least one genre");
    validator.minValue(
      "price",
      bookState.price,
      1,
      "Price should be greater than or equal to 1"
    );
    validator.minLength(
      "publisher",
      bookState.publisher,
      3,
      "Publisher name should be at least 3 characters long"
    );
    validator.match(
      DateRegex,
      "publishedDate",
      bookState.publishedDate,
      "Published Date should be in YYYY-MM-DD format"
    );
    validator.dateLessThanToday(
      "publishedDate",
      bookState.publishedDate,
      "Published Date should be less than or equal to current date"
    );

    if (validator.hasErrors()) {
      //console.log(validator);
      setErrors({ ...validator.getErrors(), isValid: false });
      return;
    } else {
      setErrors(initialErrorValues);
    }

    const formData = new FormData();
    formData.append("title", bookState.title.trim());
    formData.append("price", parseInt(bookState.price));
    formData.append("publisher", bookState.publisher.trim());
    formData.append("publishedDate", bookState.publishedDate.trim());
    formData.append("description", bookState.description.trim());
    formData.append("image", bookState.image);

    enteredAuthors.forEach((author) => {
      formData.append(`authors[]`, author);
    });

    enteredGenres.forEach((genre) => {
      formData.append(`genres[]`, genre);
    });

    if (isEditSession) {
      dispatch(
        updateBookById({
          bookId: bookId,
          token: token,
          formData,
          callback: function (bookId) {
            navigate(`/books/${bookId}`, { replace: true });
          },
        })
      );
    } else {
      dispatch(
        createBook({
          token,
          formData,
          callback: function (bookId) {
            navigate(`/books/${bookId}`, { replace: true });
          },
        })
      );
    }
  }

  if (error) {
    return (
      <div className="page-error">
        <p>{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return <SpinnerFullPage />;
  }

  return (
    <div className={styles["edit-book"]}>
      <div className={styles["form-container"]}>
        <form onSubmit={handleSubmit} className={styles["book-form"]}>
          <h1>{isEditSession ? "Edit Book" : "Add New Book"}</h1>

          <Input
            type="text"
            name="title"
            label="Title"
            placeholder="Book Title"
            value={bookState.title}
            onChange={handleChange}
            error={errors.title}
          />

          <div className={styles.row}>
            <div className={`${styles.column} ${styles["image-column"]}`}>
              <label htmlFor="image">Image</label>
              <ImageUpload
                id="image"
                name="image"
                value={
                  bookState.image
                    ? `${import.meta.env.VITE_ASSET_URL}/${bookState.image}`
                    : bookState.image
                }
                onInput={(pickedFile) =>
                  handleChange({ type: "image", value: pickedFile })
                }
              />
            </div>

            <div className={styles["major-column"]}>
              <Input
                type="number"
                name="price"
                label="Price"
                placeholder="Book Price"
                value={bookState.price}
                onChange={handleChange}
                error={errors.price}
              />

              <Input
                type="text"
                name="publisher"
                label="Publisher"
                placeholder="Book Publisher"
                value={bookState.publisher}
                onChange={handleChange}
                error={errors.publisher}
              />

              <Input
                type="date"
                name="publishedDate"
                label="Published Date"
                placeholder="Published Date"
                value={bookState.publishedDate}
                onChange={handleChange}
                error={errors.publishedDate}
              />
            </div>
          </div>

          <Input
            type="text"
            name="authors"
            label="Authors"
            placeholder="Enter comma seperated values"
            value={bookState.authors}
            onChange={handleChange}
            error={errors.authors}
          />

          <Input
            type="text"
            name="genres"
            label="Genres"
            placeholder="Enter comma seperated values"
            value={bookState.genres}
            onChange={handleChange}
            error={errors.genres}
          />

          <Input
            rows={5}
            type="textarea"
            name="description"
            label="Description"
            placeholder="Book Description"
            value={bookState.description}
            onChange={handleChange}
            error=""
          />

          <div className={styles["book-action"]}>
            {isEditSession && (
              <Button
                onClick={() => {
                  navigate(-1);
                }}
                type="secondary"
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={handleSubmit}
              disabled={!errors.isValid || !newChanges}
              buttonType="submit"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEditBook;
