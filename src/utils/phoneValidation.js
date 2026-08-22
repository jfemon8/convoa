const BD_MOBILE_REGEX = /^01[3-9]\d{8}$/;

export const normalizeBangladeshPhone = (value) => {
  const input = value.trim();

  if (input.startsWith("+88")) {
    return input.slice(3);
  }

  if (input.startsWith("88")) {
    return input.slice(2);
  }

  return input;
};

export const validateBangladeshPhone = (value) => {
  const input = value.trim();

  if (!input) {
    return "Phone number is required.";
  }

  // Only digits and an optional leading + are allowed.
  if (!/^\+?\d+$/.test(input)) {
    return "Phone number can contain only digits and an optional + prefix.";
  }

  // +88XXXXXXXXXXX
  if (input.startsWith("+")) {
    if (!input.startsWith("+88")) {
      return "Use a valid Bangladesh phone number starting with +880.";
    }

    if (input.length !== 14) {
      return "With +88, the phone number must contain exactly 14 characters.";
    }
  }

  // 88XXXXXXXXXXX
  else if (input.startsWith("88")) {
    if (input.length !== 13) {
      return "With 88, the phone number must contain exactly 13 digits.";
    }
  }

  // 01XXXXXXXXX
  else {
    if (input.length !== 11) {
      return "Phone number must contain exactly 11 digits.";
    }
  }

  const localNumber = normalizeBangladeshPhone(input);

  if (!BD_MOBILE_REGEX.test(localNumber)) {
    return "Enter a valid Bangladesh mobile number.";
  }

  return "";
};

export const formatBangladeshPhone = (value) => {
  const localNumber = normalizeBangladeshPhone(value);

  if (!BD_MOBILE_REGEX.test(localNumber)) {
    return null;
  }

  return `+88${localNumber}`;
};
