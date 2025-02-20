import { Button } from "@mui/material";

const CategoryButton = ({ category, onClick, isSelected }) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      disableRipple // Отключаем анимацию всплеска
      sx={{
        width: "150px",
        height: "50px",
        marginBottom: 2,
        backgroundColor: isSelected ? "#ff5722" : "#3f51b5", // Активная кнопка ярко-оранжевая
        color: "#fff", // Белый текст для контраста
        transition: "background-color 0.3s", // Плавное изменение цвета
        "&:hover": {
          backgroundColor: isSelected ? "#e64a19" : "#303f9f",
        },
      }}
    >
      {category}
    </Button>
  );
};

export default CategoryButton;
