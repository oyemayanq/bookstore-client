export default class Validator {
  constructor() {
    this.errors = {};
    this.isValid = true;
  }

  addError(key, errorMessage) {
    this.errors[key] = errorMessage;
    this.isValid = false;
  }

  getErrors() {
    return this.errors;
  }

  isEmpty(key, val) {
    if (val.trim().length === 0) {
      if (key === "publishedDate") {
        this.check(false, key, "Published Date cannot be empty");
      } else {
        this.check(
          false,
          key,
          `${key.substring(0, 1).toUpperCase()}${key.substring(
            1
          )} cannot be empty`
        );
      }
      return true;
    }
    return false;
  }

  check(result, key, errorMessage) {
    if (!result) {
      this.addError(key, errorMessage);
      this.isValid = false;
    }
  }

  match(regex, key, value, message) {
    if (this.isEmpty(key, value)) {
      return;
    }

    this.check(regex.test(value), key, message);
  }

  minLength(key, value, length, message) {
    if (this.isEmpty(key, value)) {
      return;
    }
    this.check(value.trim().length >= length, key, message);
  }

  maxLength(key, value, length, message) {
    if (this.isEmpty(key, value)) {
      return;
    }
    this.check(value.trim().length <= length, key, message);
  }

  minSize(key, value, size, message) {
    this.check(value.length >= size, key, message);
  }

  minValue(key, value, minimumValue, message) {
    if (typeof value !== "number") {
      this.check(false, key, `Enter a valid number`);
      return;
    }

    this.check(value >= minimumValue, key, message);
  }

  maxValue(key, value, maximumValue, message) {
    if (typeof value !== Number) {
      this.check(false, key, `Enter a valid number`);
      return;
    }

    this.check(value >= maximumValue, key, message);
  }

  dateLessThanToday(key, value, message) {
    if (this.isEmpty(key, value)) {
      return;
    }

    const date = new Date();
    const [currentYear, currentMonth, currentDate] = [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    ];
    const [enteredYear, enteredMonth, enteredDate] = value
      .split("-")
      .map((v) => parseInt(v));

    // console.log(enteredYear, enteredMonth, enteredDay);
    // console.log(currentYear, currentMonth, currentDay);

    let isValidDate = true;

    if (enteredYear > currentYear) {
      isValidDate = false;
    } else {
      if (enteredYear === currentYear) {
        if (enteredMonth > currentMonth) {
          isValidDate = false;
        } else {
          if (enteredMonth === currentMonth) {
            if (enteredDate > currentDate) {
              isValidDate = false;
            }
          }
        }
      }
    }

    this.check(isValidDate, key, message);
  }

  hasErrors() {
    return !this.isValid;
  }
}
