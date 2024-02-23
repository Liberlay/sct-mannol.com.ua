export const cachedRequest = async (request, revalidate) => {
  return fetch(`${process.env.HOST}api/v1${request}`, {
    next: { revalidate },
  }).then((res) => res.json())
}
