import unittest
from app import app
import json

class FlaskTest(unittest.TestCase):

    def test_index(self):
        tester=app.test_client(self)
        urls=['/','/doctor_list']
        for url in urls:
            response=tester.get(url)
            statuscode=response.status_code
            self.assertEqual(statuscode, 200)
        ids=['1','2','3']
        for id in ids:
            response = tester.get('/doctorpage/'+id)
            statuscode = response.status_code
            self.assertEqual(statuscode, 200)

    def test_date_format(self):
        params={'Content-Type': 'application/json'}
        with app.test_client() as c:
            rv = c.post('/get_data', json=params)
            json_data = rv.get_data()
            json_data=json.loads(json_data.decode())
            for i in range(len(json_data['availableHours'])):
                splitted=str(json_data['availableHours'][i][0]).replace('-',':').split(':')
                self.assertEqual('-' in str(json_data['availableHours'][i][0]),True)
                self.assertEqual(len(str(json_data['availableHours'][i][0])) in [9,10,11],True)
                self.assertEqual(splitted[0].isdigit(),True)
                self.assertEqual(splitted[2].isdigit(),True)
                self.assertEqual(splitted[1] in ['00','30'],True)
                self.assertEqual(splitted[3] in ['00','30'],True)
                self.assertEqual(int(splitted[0])>=8 and int(splitted[0])<=16 , True)
                self.assertEqual(int(splitted[2])>=8 and int(splitted[2])<=16 , True)



if __name__ == '__main__':
    unittest.main()