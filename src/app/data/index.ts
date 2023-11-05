// APIs that will be used more than 1 place
// 'fetch' will cache the data if URL is the same

export async function getCoffee() {
  const res = await fetch("https://api.sampleapis.com/coffee/hot", {
    next: { revalidate: 3600 },
  });
  return res.json();
}

export async function getWine() {
  const res = await fetch("https://api.sampleapis.com/wines/reds", {
    next: { revalidate: 3600 },
  });
  return res.json();
}

