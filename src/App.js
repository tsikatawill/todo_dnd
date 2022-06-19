import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { styled } from "baseui";
import { Input } from "baseui/input";
import { Plus } from "baseui/icon";
import { useEffect, useState } from "react";
import { List, arrayMove, arrayRemove } from "baseui/dnd-list";

const Centered = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  maxWidth: "1280px",
  padding: "0 1rem",
  margin: "0 auto",
});

const ListWrapper = styled("div", {
  height: "400px",
  overflow: "auto",
  margin: "1rem",
});

const Header = styled("header", {
  textAlign: "center",
  marginBottom: "1rem",
});

const getLocalTodos = () => {
  let list = localStorage.getItem("dnd_todo_list");

  if (list) return JSON.parse(list);
  return [];
};

const App = () => {
  const [inputTodo, setInputTodo] = useState("");
  const [todoList, setTodoList] = useState(getLocalTodos());

  const engine = new Styletron();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputTodo.length > 0) {
      setTodoList([...todoList, inputTodo]);
      setInputTodo("");
    }
  };

  useEffect(() => {
    localStorage.setItem("dnd_todo_list", JSON.stringify(todoList));
  }, [todoList]);

  return (
    <StyletronProvider value={engine}>
      <div className="App">
        <Header>
          <h1>TODO D&D</h1>
          <p>A simple intuitive drag and drop todo list</p>
        </Header>
        <main>
          <Centered>
            <form onSubmit={(e) => handleSubmit(e)}>
              <Input
                value={inputTodo}
                overrides={{
                  Root: {
                    style: {
                      borderRadius: "5px",
                    },
                  },
                }}
                endEnhancer={
                  <Plus
                    size="20px"
                    style={{ cursor: "pointer" }}
                    onClick={(e) => handleSubmit(e)}
                  />
                }
                onChange={(e) => setInputTodo(e.currentTarget.value)}
              />
            </form>
            {todoList.length > 0 ? (
              <ListWrapper>
                <List
                  removable
                  items={todoList}
                  overrides={{
                    Root: {
                      style: {
                        maxWidth: "400px",
                        minWidth: "300px",
                      },
                    },
                    List: {
                      style: {
                        background: "none",
                      },
                    },
                    Item: {
                      style: {
                        margin: "10px 0",
                        background: "#0000009e",
                        color: "white",
                        borderRadius: "5px",
                      },
                    },
                    CloseHandle: {
                      style: {
                        color: "red",
                      },
                    },
                  }}
                  onChange={({ oldIndex, newIndex }) =>
                    setTodoList(
                      newIndex === -1
                        ? arrayRemove(todoList, oldIndex)
                        : arrayMove(todoList, oldIndex, newIndex)
                    )
                  }
                />
              </ListWrapper>
            ) : (
              <ListWrapper>
                <p>Your list is looking a bit empty</p>
              </ListWrapper>
            )}
          </Centered>
        </main>
      </div>
    </StyletronProvider>
  );
};

export default App;
