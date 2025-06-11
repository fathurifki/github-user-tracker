type FetchOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number | boolean>;
  signal?: AbortSignal;
};

export async function apiFetch<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    headers = {},
    body,
    params,
    signal,
  } = options;

  let finalUrl = url;
  
  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      query.append(key, String(value));
    }
    finalUrl += (url.includes('?') ? '&' : '?') + query.toString();
  }

  // Prepare fetch options
  const fetchOptions: RequestInit = {
    method,
    headers,
    signal,
  };

  if (body !== undefined) {
    if (
      typeof body === 'object' &&
      !(body instanceof FormData) &&
      !(body instanceof Blob)
    ) {
      fetchOptions.body = JSON.stringify(body);
      fetchOptions.headers = {
        ...headers,
        'Content-Type': 'application/json',
      };
    } else {
      fetchOptions.body = body;
    }
  }

  const response = await fetch(finalUrl, fetchOptions);

  const contentType = response.headers.get('content-type');
  let data: any;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    throw {
      status: response.status,
      statusText: response.statusText,
      data,
    };
  }

  return data as T;
}
