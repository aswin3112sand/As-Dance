const RECEIPT_KEY = "asdance_payment_receipt";
const PENDING_KEY = "asdance_pending_order";
const FAILURE_KEY = "asdance_payment_failure";

function getStorage(preferSession) {
  if (typeof window === "undefined") return null;
  const session = preferSession ? window.sessionStorage : null;
  return session || window.localStorage;
}

function readJson(storage, key) {
  if (!storage) return null;
  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeJson(storage, key, value) {
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or access errors.
  }
}

function removeKey(key) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // Ignore storage errors.
  }
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage errors.
  }
}

function matchesUser(payload, userId) {
  if (!payload) return false;
  if (!userId || !payload.userId) return true;
  return payload.userId === userId;
}

export function savePendingOrder(order, userId) {
  if (!order) return;
  const payload = { ...order, userId, savedAt: Date.now() };
  writeJson(getStorage(true), PENDING_KEY, payload);
}

export function loadPendingOrder(userId) {
  const payload = readJson(getStorage(true), PENDING_KEY);
  if (!matchesUser(payload, userId)) return null;
  return payload;
}

export function clearPendingOrder() {
  removeKey(PENDING_KEY);
}

export function saveReceipt(receipt, userId) {
  if (!receipt) return;
  const payload = { ...receipt, userId, savedAt: Date.now() };
  writeJson(getStorage(false), RECEIPT_KEY, payload);
}

export function loadReceipt(userId) {
  const payload = readJson(getStorage(false), RECEIPT_KEY);
  if (!matchesUser(payload, userId)) return null;
  return payload;
}

export function clearReceipt() {
  removeKey(RECEIPT_KEY);
}

export function saveFailure(failure, userId) {
  if (!failure) return;
  const payload = { ...failure, userId, savedAt: Date.now() };
  writeJson(getStorage(true), FAILURE_KEY, payload);
}

export function loadFailure(userId) {
  const payload = readJson(getStorage(true), FAILURE_KEY);
  if (!matchesUser(payload, userId)) return null;
  return payload;
}

export function clearFailure() {
  removeKey(FAILURE_KEY);
}
