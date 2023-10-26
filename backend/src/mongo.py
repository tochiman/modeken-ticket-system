from pymongo import MongoClient
from fastapi import HTTPException
from datetime import datetime

class ModekenSystemManager:
    
    def __init__(self, username, password):
        self.client = MongoClient(f'mongodb://{username}:{password}@db.modeken-system.com:27017')
        self.db = self.client['modeken-system']
        self.collections = self.db['collections']
        self.manager = {}

    def new(self, item_type):
        self.manager[f'{item_type}'] = Manager(self.db[f'tickets-{item_type}'], self.collections, item_type)
        if not self.collections.find_one({'item_type': item_type}):
            self.collections.insert_one({'item_type': item_type, 'count': 0})
        return self.manager[f'{item_type}']

class CollectionManager:

    def __init__(self, collections, item_type):
        self.collections = collections
        self.item_type = item_type
    
    def add_collection(self):
        if not self.collections.update_one({'item_type': self.item_type}, {'$inc': {'count':1}}):
            raise HTTPException(status_code=500, detail='Internal Server Error')

    def get_collection(self):
        d = self.collections.find_one({'item_type': self.item_type})
        if not d:
            raise HTTPException(status_code=500, detail='Internal Server Error')
        del d['_id']
        del d['item_type']
        return d

    def reset_collection(self):
        if not self.collections.update_one({'item_type': self.item_type}, {'$set': {'count':0}}):
            raise HTTPException(status_code=500, detail='Internal Server Error')

class TicketManager:

    def __init__(self, tickets):
        self.tickets = tickets
        self.last_ticket = 0

    def get_tickets_wait(self):
        data = []
        for i in self.tickets.find({'status': 'wait'}):
            del i['_id']
            del i['status']
            data.append(i)
        return data
    
    def get_tickets_ready(self):
        data = []
        for i in self.tickets.find({'status': 'ready'}):
            del i['_id']
            del i['status']
            data.append(i)
        return data

    def get_tickets(self):
        data = []
        for i in self.tickets.find():
            del i['_id']
            data.append(i)
        return data
        
    def to_ready_ticket(self, item_number):
        if not self.tickets.find_one({'$and': [{'item_number': item_number}, {'status': 'wait'}]}):
            raise HTTPException(status_code=404, detail=f'Not Found: {item_number}')
        return self.tickets.update_one({'$and': [{'item_number': item_number}, {'status': 'wait'}]}, {'$set': {'status': 'ready'}})
    
    def to_wait_ticket(self, item_number):
        if not self.tickets.find_one({'$and': [{'item_number': item_number}, {'status': 'ready'}]}):
            raise HTTPException(status_code=404, detail=f'Not Found: {item_number}')
        return self.tickets.update_one({'$and': [{'item_number': item_number}, {'status': 'ready'}]}, {'$set': {'status': 'wait'}})

    def cancel_ticket(self, item_number):
        if not self.tickets.find_one({'$and': [{'item_number': item_number}, {'status': 'wait'}]}):
            raise HTTPException(status_code=404, detail=f'Not Found: {item_number}')
        return self.tickets.update_one({'$and': [{'item_number': item_number}, {'status': 'wait'}]}, {'$set': {'status': 'cancel'}})
    
    def delete_ticket(self, item_number):
        if not self.tickets.find_one({'$and': [{'item_number': item_number}, {'status': 'ready'}]}):
            raise HTTPException(status_code=404, detail=f'Not Found: {item_number}')
        return self.tickets.update_one({'$and': [{'item_number': item_number}, {'status': 'ready'}]}, {'$set': {'status': 'delete'}})

    def add_ticket(self):
        self.last_ticket += 1
        item_number = self.last_ticket
        now = datetime.now().strftime('%H:%M')
        data = {'item_number': item_number, 'status': 'wait', 'created_time': now}
        if self.tickets.find_one({'item_number': item_number}):
            return self.add_ticket()
        else:
            if not self.tickets.insert_one(data):
                raise HTTPException(status_code=500, detail='Internal Server Error')
            return item_number, now
        
    def reset_tickets(self):
        if not self.tickets.delete_many({}):
            raise HTTPException(status_code=500, detail='Internal Server Error')
        else:
            self.last_ticket = 0

class Manager(CollectionManager, TicketManager):

    def __init__(self, tickets, collections, item_type):
        CollectionManager.__init__(self, collections, item_type)
        TicketManager.__init__(self, tickets)

    def delete_ticket(self, item_number):
        super().delete_ticket(item_number)
        super().add_collection()
