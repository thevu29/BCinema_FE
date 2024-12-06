import { Button, Container, Flex, Image, Text, Title } from "@mantine/core";
import image from "../../assets/images/not-found.avif";
import classes from "./NotFound.module.scss";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Container className={classes.root}>
      <Flex align="center" gap={24}>
        <div>
          <Title className={classes.title}>Something is not right...</Title>
          <Text c="dimmed" size="lg">
            Page you are trying to open does not exist. You may have mistyped
            the address, or the page has been moved to another URL. If you think
            this is an error contact support.
          </Text>
          <Link to="/">
            <Button
              variant="outline"
              size="md"
              mt="xl"
              className={classes.control}
            >
              Get back to home page
            </Button>
          </Link>
        </div>
        <Image w={450} src={image} className={classes.desktopImage} />
      </Flex>
    </Container>
  );
};

export default NotFound;
