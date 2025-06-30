import pandas as pd
from sklearn.model_selection import train_test_split
from catboost import CatBoostClassifier



df = pd.read_csv("./ai/dataset.csv")
df = pd.DataFrame(df)

y = df.target
x = df.drop(columns=['target'], inplace=False)


x_treino, x_teste, y_treino, y_teste = train_test_split(x, y , test_size= 0.20, shuffle=True, stratify=y, random_state=52)


# ------------ CatBoost -----------

CatBoost_model = CatBoostClassifier(
    border_count= 128, 
    depth= 6, 
    iterations= 200, 
    l2_leaf_reg= 3, 
    learning_rate= 0.1
)

CatBoost_model.fit(x_treino, y_treino)

y_pred_CB = CatBoost_model.predict(x_teste)