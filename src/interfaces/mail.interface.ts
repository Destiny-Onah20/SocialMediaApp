interface mailInterface {
  email: string;
  subject: string;
  from: {
    name?: string,
    address: string | undefined
  },
  message: string;
  html: string
}

export default mailInterface;