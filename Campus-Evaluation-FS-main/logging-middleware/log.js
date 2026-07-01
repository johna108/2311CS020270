const API_BASE = "http://4.224.186.213/evaluation-service";
let _token = "";

export function setToken(t) { _token = t; }

/**
 * Reusable logging function.
 * @param {"backend"|"frontend"} stack
 * @param {"debug"|"info"|"warn"|"error"|"fatal"} level
 * @param {string} pkg - frontend: api|component|hook|page|state|style; shared: auth|config|middleware|utils
 * @param {string} message
 */
export async function Log(stack, level, pkg, message) {
  try {
    const res = await fetch(`${API_BASE}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${_token}`,
      },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });
    return await res.json();
  } catch (e) {
    console.error("Log failed:", e);
  }
}
