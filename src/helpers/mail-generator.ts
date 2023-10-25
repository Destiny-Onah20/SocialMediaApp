import mailgen from "mailgen";


const mailGenerator = new mailgen({
  theme: "default",
  product: {
    name: "SocialCommerce",
    logo: "Social-commerce",
    link: "#"
  }
});

export default mailGenerator;