class PromptService:
    
    @staticmethod
    def build_prompt(learning_text, style, audience, data):
        prompt = f"""
        You are an expert Linkedin content strategist
        Write with broad context awarness cite trends , add data angles , be forward looking
        Transform the user request into an engaging linkedin post
        
        IMPORTANT:
        The entire post must be below 100 words
        
        User Request : {learning_text} 
        Writing Style : {style}
        Audience : {audience}
        
        Keywords : {','.join(data.get('Keywords', []))}
        Nouns : {','.join(data.get('Nouns', []))}
        Entities : {','.join(data.get('Entity', []))}
        Sentiment : {data.get('Sentiment', 'Nuetral')}
        
        Requirements:
        - Strong Hook
        - Personalised post
        - Actionable insight
        - Avoid generic AI phrases
        - Sounds more like human than AI generated
        - Call to action
        - 5 hashtags
        
        Return only the final Linkedin Post
        """
        return prompt
