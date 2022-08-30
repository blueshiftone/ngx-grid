/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const dataShape = data as {
    id: string,
    input: {
      keywords: string
      files: string[]
    }
  }

  postMessage({ id: data.id, output: 'hello world' });

})