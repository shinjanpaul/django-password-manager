import graphene
from graphene_django import DjangoObjectType
from passwords.models import PasswordEntry

class PasswordEntryType(DjangoObjectType):
    password = graphene.String()
    
    class Meta:
        model = PasswordEntry
        fields = ('id', 'website_url', 'username', 'created_at', 'updated_at')
    
    def resolve_password(self, info):
        return self.get_password()


class Query(graphene.ObjectType):
    my_passwords = graphene.List(PasswordEntryType)
    
    def resolve_my_passwords(self, info):
        return PasswordEntry.objects.all()


class CreatePassword(graphene.Mutation):
    class Arguments:
        website_url = graphene.String(required=True)
        username = graphene.String(required=True)
        password = graphene.String(required=True)
    
    password_entry = graphene.Field(PasswordEntryType)
    
    def mutate(self, info, website_url, username, password):
        user = info.context.user
        

        if not user.is_authenticated:
            from django.contrib.auth.models import User
            user = User.objects.first()
            if not user:
                raise Exception('No users found. Create a superuser first!')
        

        entry = PasswordEntry(user=user, website_url=website_url, username=username)
        entry.set_password(password)
        entry.save()
        return CreatePassword(password_entry=entry)


class DeletePassword(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
    
    success = graphene.Boolean()
    
    def mutate(self, info, id):
        user = info.context.user
        

        if not user.is_authenticated:
            from django.contrib.auth.models import User
            user = User.objects.first()
            if not user:
                raise Exception('No users found!')
        

        entry = PasswordEntry.objects.filter(id=id).first()
        if entry:
            entry.delete()
            return DeletePassword(success=True)
        return DeletePassword(success=False)


class Mutation(graphene.ObjectType):
    create_password = CreatePassword.Field()
    delete_password = DeletePassword.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)