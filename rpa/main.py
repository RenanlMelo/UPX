from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium import webdriver
from time import sleep
import requests

options = Options()
options.add_argument("--start-maximized")

# Setup driver
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# Test: Open a website
driver.get("http://localhost:3000/")

driver.find_element(By.XPATH, "//p[contains(text(), 'Gerenciamento')]").click()

table = driver.find_element(By.XPATH, "//table[@id='tabela_gerenciamento']")

headers = table.find_elements(By.TAG_NAME, "th")
header_data = [header.text for header in headers]

table_data = []
date_list = ["03/06/2025"]

for index in range(1):
    next = True
    while(next):
        rows = table.find_elements(By.TAG_NAME, "tr")

        try: 
            next_page = driver.find_element(By.XPATH, "//button[@id='next_page']")
        except:
            next_page = None

        rows = driver.find_elements(By.TAG_NAME, "tr")
        for i in range(len(rows)):
            rows = driver.find_elements(By.TAG_NAME, "tr")  # Re-locate each iteration
            row = rows[i]
            cells = row.find_elements(By.TAG_NAME, "td")
            row_data = [cell.text for cell in cells]

            if row_data:
                driver.find_element(By.XPATH, f"//tr[td[contains(., '{row_data[0]}')] and td[contains(., '{row_data[1]}')] and td[contains(., '{row_data[2]}')] and td[contains(., '{row_data[3]}')] ]").click()
                descricao = driver.find_element(By.XPATH, "//p[@id='descricao']").text
                protocolo = driver.find_element(By.XPATH, "//p[@id='protocolo']").text
                departamento = driver.find_element(By.XPATH, "//p[@id='departamento']").text
                row_data.extend([descricao, protocolo, departamento, date_list[index]])
                table_data.append(row_data)
                driver.find_element(By.XPATH, f"//tr[td[contains(., '{row_data[0]}')] and td[contains(., '{row_data[1]}')] and td[contains(., '{row_data[2]}')] and td[contains(., '{row_data[3]}')] ]").click()
        if next_page:
            next_page.click()
            sleep(1)
            continue
        next = False
        sleep(.75)
    
    # if index < 2:
    #     driver.find_element(By.XPATH, "//button[@aria-labelledby='listbox-label']").click()
    #     driver.find_element(By.XPATH, f"//li[contains(text(), '{date_list[index+1]}')]").click()
    #     sleep(.5) 


for row in table_data:
    print(row)

# Close the browser
driver.quit()

# ENVIO DADOS API
# Estruturação dos dados para o POST
payload = []

for row in table_data:
    payload.append({
        "device_name": row[0],
        "device_ip": row[1],
        "upload_mb": float(row[2]),
        "download_mb": float(row[3]),
        "description": row[4],
        "protocol_name": row[5],
        "department_name": row[6],
        "log_date": row[7]
    })

# URL da API
url = "http://localhost:8000/device_traffic_logs"

# Requisição POST
try:
    response = requests.post(url, json=payload)
    response.raise_for_status()
    print("✅ Dados enviados com sucesso!")
    print("Resposta:", response.json())
except requests.exceptions.RequestException as e:
    print("❌ Erro ao enviar os dados:", e)
