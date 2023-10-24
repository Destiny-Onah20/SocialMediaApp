import mailgen from "mailgen";


const mailGenerator = new mailgen({
  theme: "salted",
  product: {
    name: "SocialCommerce",
    logo: "Social-commerce",
    link: "#"
  }
});

export default mailGenerator;