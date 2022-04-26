const Instruction = ({ instructions }) => {
  return (
    <div style={{ textAlign: "start", color: "#484848", margin: "3rem 0" }}>
      <ol>
        <li>
          {" "}
          <p style={{ fontSize: "15px" }}>Marking Scheme</p>
          <ul>
            {instructions.map((item, index) => {
              return <li key={index}>{item}</li>;
            })}
          </ul>
        </li>
      </ol>
    </div>
  );
};

export default Instruction;
