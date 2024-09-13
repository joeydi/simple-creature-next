import Column from "./components/Column";
import Container from "./components/Container";
import PageHeader from "./components/PageHeader";
import Row from "./components/Row";

export default function Home() {
  return (
    <>
      <PageHeader>
        <h1 className="h2">intelligence, not artificial</h1>
      </PageHeader>
      <div className="hero">
        <Container>
          <Row className="align-items-end">
            <Column lg="7">
              <h1>
                General
                <br /> Statement
              </h1>
            </Column>
            <Column lg="5">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel
                facilisis.
              </p>
            </Column>
          </Row>
        </Container>
      </div>
    </>
  );
}
