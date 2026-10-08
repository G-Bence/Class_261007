import { Body, Controller, Get, Post, Query, Render } from '@nestjs/common';
import { AppService } from './app.service.js';
import { ArticleView } from './ArticleView.js';
import { ArticleViewDto } from './createarticle.dto.js';
import * as fs from 'fs';


@Controller()
export class AppController {
  private articles: ArticleView[] =  JSON.parse(fs.readFileSync("./src/wiki_articles.json", 'utf-8'));  
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      title: 'My First NestJS App',
      data: this.articles.toSorted((a, b) => b.title.localeCompare(a.title)) // Sort articles by title in ascending order
    }
  }

  @Get('filter')
  @Render('filter')
  getFilter(@Query('search') search?: string) {
    return {
      title: 'Filter Articles',
      data: this.articles.filter(article => article.title.toLowerCase().includes(search?.toLocaleLowerCase() || '')).toSorted((a, b) => b.views - a.views) // Filter articles by title and sort in ascending order
    }  }



  @Get('newArticle')
  @Render('newArticle')
  getNewArticleForm() {
    return {
      title: 'Add New Article',
      data: this.articles
    }
  }


  @Post('newArticle')
  @Render('newArticle')
  getNewArticle(@Body() body: ArticleViewDto) {
    const newArticleData: ArticleView = {
      title : body.title,
      url: body.url,
      views: parseInt(body.views)
    };
    this.articles.push(newArticleData);
    
    
    return {
      title: 'Add New Article',
      success: true,
      data: this.articles
    };

  }
}
