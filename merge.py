import pandas as pd

file_path1 = '/Users/eyx/data/all_results.csv'
file_path2 = '/Users/eyx/MetaModelTrainTest.csv'


df1 = pd.read_csv(file_path1)
df2 = pd.read_csv(file_path2)

merged_df = pd.merge(df1, df2, on='FileName', how='inner')


merged_df.to_csv('merged_table.csv', index=False)

print(f"合并后的表格已保存至 'merged_table.csv'")