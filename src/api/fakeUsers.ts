export type FakeApiUser = {
  id: number;
  uuid: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  image: string;
};

type FakeApiResponse<T> = {
  status: 'OK' | 'ERROR';
  code: number;
  total: number;
  data: T[];
};

export async function fetchFakeUsers(options?: {
  quantity?: number;
  seed?: number;
}): Promise<FakeApiUser[]> {
  const quantity = options?.quantity ?? 20;
  const seed = options?.seed ?? 123;

  const url = `https://fakerapi.it/api/v1/users?_quantity=${quantity}&_seed=${seed}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as FakeApiResponse<FakeApiUser>;
  if (!json || json.status !== 'OK' || !Array.isArray(json.data)) {
    throw new Error('Unexpected API response');
  }

  return json.data;
}

